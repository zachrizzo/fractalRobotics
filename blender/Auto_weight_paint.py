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

    # Ensure that vertex groups exist for all bones in the armature
    for bone in arm_data.bones:
        if bone.name not in obj.vertex_groups:
            obj.vertex_groups.new(name=bone.name)

    # Ensure we're in Object mode for proper operator execution
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='OBJECT')

    mesh = obj.data

    # (Optional) Clear existing weights if you want a fresh start:
    for vg in obj.vertex_groups:
        # Remove weight from every vertex in this group
        # Note: This does not delete the group, it resets all weights to 0.
        vg.remove(range(len(mesh.vertices)))

    # Process each vertex
    for v in mesh.vertices:
        # Get the vertex's world-space coordinate
        v_world = obj.matrix_world @ v.co

        qualifying_bones = []
        min_dist = None
        closest_bone = None

        # Loop over every bone in the armature
        for bone in arm_data.bones:
            # Get the bone head and tail in world space.
            # Using head_local and tail_local then transforming by the armature's matrix_world.
            bone_head = arm_obj.matrix_world @ bone.head_local
            bone_tail = arm_obj.matrix_world @ bone.tail_local

            # Compute distance from vertex to bone segment and the projection factor t
            dist, t = point_line_distance(v_world, bone_head, bone_tail)

            # Interpolate the envelope radius along the bone.
            # (Assumes bone.head_radius and bone.tail_radius are set.)
            radius = (1 - t) * bone.head_radius + t * bone.tail_radius

            # If the radius is zero (or nearly so), skip envelope check for this bone.
            if radius < 1e-6:
                continue

            # Check if vertex lies within the bone's envelope.
            if dist <= radius:
                qualifying_bones.append(bone.name)

            # Track the closest bone (fallback in case no bone qualifies)
            if (min_dist is None) or (dist < min_dist):
                min_dist = dist
                closest_bone = bone.name

        # If no bones qualify via the envelope test, fallback to the closest bone.
        if not qualifying_bones:
            qualifying_bones = [closest_bone]

        # Evenly distribute weight among the qualifying bones.
        even_weight = 1.0 / len(qualifying_bones)
        for bone_name in qualifying_bones:
            group = obj.vertex_groups.get(bone_name)
            if group is not None:
                group.add([v.index], even_weight, 'REPLACE')

print("Even weight assignment complete.")
