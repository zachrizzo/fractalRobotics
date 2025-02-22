import bpy
import mathutils
import math

def point_line_distance(point, line_start, line_end):
    """
    Computes the shortest distance from a point to a line segment defined by line_start and line_end.
    Also returns the clamped projection parameter t (0 <= t <= 1) along the line.
    """
    line_vec = line_end - line_start
    p_vec = point - line_start
    line_len_sq = line_vec.length_squared
    if line_len_sq == 0.0:
        return (point - line_start).length, 0.0
    t = p_vec.dot(line_vec) / line_len_sq
    t = max(0.0, min(1.0, t))
    projection = line_start + t * line_vec
    return (point - projection).length, t

# Store the original active object and mode
original_active = bpy.context.active_object
original_mode = bpy.context.mode

# Loop over all selected objects of type 'MESH'
selected_meshes = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']

for obj in selected_meshes:
    # Look for an Armature modifier on the mesh
    arm_mod = None
    for mod in obj.modifiers:
        if mod.type == 'ARMATURE' and mod.object is not None:
            arm_mod = mod
            break

    if arm_mod is None:
        print(f"Object '{obj.name}' has no Armature modifier. Skipping.")
        continue

    arm_obj = arm_mod.object
    arm_data = arm_obj.data

    # Make sure we're in Object mode and the current object is active
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='OBJECT')

    # Ensure proper parent-child relationship
    if obj.parent != arm_obj:
        obj.parent = arm_obj
        obj.parent_type = 'ARMATURE'

    # Ensure the armature modifier is first in the stack
    if obj.modifiers[0] != arm_mod:
        bpy.context.view_layer.objects.active = obj
        override = bpy.context.copy()
        override["object"] = obj
        override["active_object"] = obj
        bpy.ops.object.modifier_move_to_index(override, modifier=arm_mod.name, index=0)

    mesh = obj.data
    mesh.update()

    # Clear existing vertex groups
    for vg in obj.vertex_groups:
        obj.vertex_groups.remove(vg)

    # Create vertex groups for each bone
    for bone in arm_data.bones:
        vg = obj.vertex_groups.new(name=bone.name)

    # Ensure vertex groups are updated
    obj.update_from_editmode()

    # Process each vertex
    for v in mesh.vertices:
        v_world = obj.matrix_world @ v.co

        qualifying_bones = []
        min_dist = None
        closest_bone = None

        for bone in arm_data.bones:
            bone_head = arm_obj.matrix_world @ bone.head_local
            bone_tail = arm_obj.matrix_world @ bone.tail_local

            dist, t = point_line_distance(v_world, bone_head, bone_tail)
            radius = (1 - t) * bone.head_radius + t * bone.tail_radius

            if radius < 1e-6:
                continue

            if dist <= radius:
                qualifying_bones.append(bone.name)

            if (min_dist is None) or (dist < min_dist):
                min_dist = dist
                closest_bone = bone.name

        if not qualifying_bones:
            qualifying_bones = [closest_bone]

        even_weight = 1.0 / len(qualifying_bones)
        for bone_name in qualifying_bones:
            group = obj.vertex_groups.get(bone_name)
            if group is not None:
                group.add([v.index], even_weight, 'REPLACE')

    # Force updates through mode changes
    bpy.ops.object.mode_set(mode='WEIGHT_PAINT')
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.object.mode_set(mode='OBJECT')

    # Force dependency graph update
    bpy.context.view_layer.update()

    # Force data update
    mesh.update()
    obj.update_from_editmode()

    # Tag mesh and object for update
    mesh.tag = True
    obj.tag = True

# Restore original active object and mode
if original_active:
    bpy.context.view_layer.objects.active = original_active
    if original_mode != 'OBJECT':
        bpy.ops.object.mode_set(mode=original_mode)

print("Weight assignment complete - vertex groups should now persist.")
