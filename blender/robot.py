import bpy
import bmesh

# ----------------------------------------------------------------
# 1. Clean up the existing scene by directly removing objects and collections
# ----------------------------------------------------------------
# Remove all objects
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

# Remove all collections except the default "Collection"
for coll in list(bpy.data.collections):
    if coll.name != "Collection":
        bpy.data.collections.remove(coll)

# Create a new collection for our robot
robot_collection = bpy.data.collections.new("RobotCollection")
bpy.context.scene.collection.children.link(robot_collection)

# ----------------------------------------------------------------
# 2. Create Materials
# ----------------------------------------------------------------

# A) Medium gray metal for hardware
metal_mat = bpy.data.materials.new(name="MetalHardwareMaterial")
metal_mat.use_nodes = True
m_nodes = metal_mat.node_tree.nodes
m_principled = m_nodes.get("Principled BSDF")
if m_principled:
    m_principled.inputs["Base Color"].default_value = (0.5, 0.5, 0.5, 1.0)
    m_principled.inputs["Metallic"].default_value = 0.8
    m_principled.inputs["Roughness"].default_value = 0.3

# B) Darker metal (for rings/brackets)
dark_metal_mat = bpy.data.materials.new(name="DarkMetalMaterial")
dark_metal_mat.use_nodes = True
dm_nodes = dark_metal_mat.node_tree.nodes
dm_principled = dm_nodes.get("Principled BSDF")
if dm_principled:
    dm_principled.inputs["Base Color"].default_value = (0.25, 0.25, 0.25, 1.0)
    dm_principled.inputs["Metallic"].default_value = 0.9
    dm_principled.inputs["Roughness"].default_value = 0.2

# C) Off-white plastic (arms/legs, etc.)
plastic_mat = bpy.data.materials.new(name="PlasticMaterial")
plastic_mat.use_nodes = True
p_nodes = plastic_mat.node_tree.nodes
p_principled = p_nodes.get("Principled BSDF")
if p_principled:
    p_principled.inputs["Base Color"].default_value = (0.95, 0.95, 0.92, 1)
    p_principled.inputs["Metallic"].default_value = 0.0
    p_principled.inputs["Roughness"].default_value = 0.4

# D) Matte white (upper/lower torso + head back)
white_mat = bpy.data.materials.new(name="WhiteMaterial")
white_mat.use_nodes = True
w_nodes = white_mat.node_tree.nodes
w_principled = w_nodes.get("Principled BSDF")
if w_principled:
    w_principled.inputs["Base Color"].default_value = (1.0, 1.0, 1.0, 1)
    w_principled.inputs["Metallic"].default_value = 0.0
    w_principled.inputs["Roughness"].default_value = 0.5

# E) Glass visor
glass_mat = bpy.data.materials.new(name="GlassMaterial")
glass_mat.use_nodes = True
g_nodes = glass_mat.node_tree.nodes
g_principled = g_nodes.get("Principled BSDF")
if g_principled:
    g_principled.inputs["Base Color"].default_value = (1, 1, 1, 1)
    g_principled.inputs["Metallic"].default_value = 0.0
    g_principled.inputs["Specular"].default_value = 1.0
    g_principled.inputs["Roughness"].default_value = 0.0
    g_principled.inputs["Transmission"].default_value = 1.0

# F) Emissive screen material
screen_mat = bpy.data.materials.new(name="ScreenMaterial")
screen_mat.use_nodes = True
s_nodes = screen_mat.node_tree.nodes
# Remove default nodes
for node in list(s_nodes):
    s_nodes.remove(node)
emission_node = s_nodes.new("ShaderNodeEmission")
emission_node.location = (-200, 0)
emission_node.inputs["Color"].default_value = (0.2, 0.8, 1.0, 1)
emission_node.inputs["Strength"].default_value = 5.0
screen_out = s_nodes.new("ShaderNodeOutputMaterial")
screen_out.location = (0, 0)
s_links = screen_mat.node_tree.links
s_links.new(emission_node.outputs["Emission"], screen_out.inputs["Surface"])

# G) Neck fabric (off-white procedural)
neck_mat = bpy.data.materials.new(name="NeckFabricMaterial")
neck_mat.use_nodes = True
n_nodes = neck_mat.node_tree.nodes
for node in list(n_nodes):
    n_nodes.remove(node)
tex_coord = n_nodes.new(type="ShaderNodeTexCoord")
mapping = n_nodes.new(type="ShaderNodeMapping")
noise = n_nodes.new(type="ShaderNodeTexNoise")
color_ramp = n_nodes.new(type="ShaderNodeValToRGB")
bump = n_nodes.new(type="ShaderNodeBump")
neck_bsdf = n_nodes.new(type="ShaderNodeBsdfPrincipled")
neck_out = n_nodes.new(type="ShaderNodeOutputMaterial")
tex_coord.location = (-900, 200)
mapping.location = (-700, 200)
noise.location = (-500, 200)
color_ramp.location = (-300, 200)
bump.location = (-100, 200)
neck_bsdf.location = (100, 200)
neck_out.location = (300, 200)
noise.inputs["Scale"].default_value = 50.0
noise.inputs["Detail"].default_value = 16.0
color_ramp.color_ramp.elements[0].color = (0.9, 0.9, 0.85, 1)
color_ramp.color_ramp.elements[1].color = (0.95, 0.95, 0.9, 1)
bump.inputs["Strength"].default_value = 0.1
neck_bsdf.inputs["Base Color"].default_value = (0.95, 0.95, 0.9, 1)
neck_bsdf.inputs["Roughness"].default_value = 0.8
n_links = neck_mat.node_tree.links
n_links.new(tex_coord.outputs["Object"], mapping.inputs["Vector"])
n_links.new(mapping.outputs["Vector"], noise.inputs["Vector"])
n_links.new(noise.outputs["Fac"], color_ramp.inputs["Fac"])
n_links.new(color_ramp.outputs["Color"], bump.inputs["Height"])
n_links.new(bump.outputs["Normal"], neck_bsdf.inputs["Normal"])
n_links.new(neck_bsdf.outputs["BSDF"], neck_out.inputs["Surface"])

# H) Text material (for "Fractal Robotics")
text_mat = bpy.data.materials.new(name="TextMaterial")
text_mat.use_nodes = True
txt_nodes = text_mat.node_tree.nodes
txt_principled = txt_nodes.get("Principled BSDF")
if txt_principled:
    txt_principled.inputs["Base Color"].default_value = (1, 1, 1, 1)
    txt_principled.inputs["Metallic"].default_value = 0
    txt_principled.inputs["Roughness"].default_value = 0

# ----------------------------------------------------------------
# 3. Helper Function: Bevel and Subdivision
# ----------------------------------------------------------------
def bevel_and_subdivide(obj, bevel_width=0.02, bevel_segments=2, subdiv_levels=1):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    # Apply a Bevel modifier
    bpy.ops.object.modifier_add(type='BEVEL')
    bev = obj.modifiers[-1]
    bev.width = bevel_width
    bev.segments = bevel_segments
    bpy.ops.object.modifier_apply(modifier=bev.name)
    # Optionally, apply a Subdivision Surface modifier
    if subdiv_levels > 0:
        bpy.ops.object.modifier_add(type='SUBSURF')
        subd = obj.modifiers[-1]
        subd.levels = subdiv_levels
        bpy.ops.object.modifier_apply(modifier=subd.name)
    bpy.ops.object.shade_smooth()
    obj.select_set(False)

def add_edge_loops(obj, num_cuts=2):
    """
    Programmatically add edge loops to an object using bmesh

    :param obj: Blender object to modify
    :param num_cuts: Number of cuts to add
    """
    # Ensure we're in object mode before editing
    bpy.ops.object.mode_set(mode='OBJECT')

    # Set the object as active and selected
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    # Switch to edit mode
    bpy.ops.object.mode_set(mode='EDIT')

    # Create a bmesh from the object's mesh
    bm = bmesh.from_edit_mesh(obj.data)

    # Get all edges
    edges = [e for e in bm.edges]

    # Perform subdivision
    bmesh.ops.subdivide_edges(
        bm,
        edges=edges,
        cuts=num_cuts,
        use_smooth_even=True
    )

    # Update the mesh
    bmesh.update_edit_mesh(obj.data)

    # Return to object mode
    bpy.ops.object.mode_set(mode='OBJECT')

# ----------------------------------------------------------------
# Create F.02-Style Robot Head
# ----------------------------------------------------------------
# Create slim head base
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.2, depth=0.35, location=(0, 0, 1.9))
head_base = bpy.context.active_object
head_base.name = "HeadBase"
head_base.scale = (1.0, 0.7, 1.0)  # Oval shape from front
head_base.data.materials.append(white_mat)
bevel_and_subdivide(head_base, bevel_width=0.02, bevel_segments=3, subdiv_levels=2)

# Create glass face panel
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.18, depth=0.02, location=(0, 0.17, 1.9))
face_glass = bpy.context.active_object
face_glass.name = "FaceGlass"
face_glass.rotation_euler.x = 1.5708  # Rotate to face forward
face_glass.scale = (1.0, 0.7, 1.0)  # Match head shape
face_glass.data.materials.append(glass_mat)

# Create screen display (slightly inset from glass)
bpy.ops.mesh.primitive_plane_add(size=0.25, location=(0, 0.16, 1.9))
screen = bpy.context.active_object
screen.name = "Screen"
screen.scale = (0.5, 0.5, 1.0)
# Add pixel pattern to screen
pixels = []
for i in range(3):  # 3 small squares
    bpy.ops.mesh.primitive_cube_add(size=0.02, location=(0.02 * (i-1), 0.16, 1.91))
    pixel = bpy.context.active_object
    pixel.name = f"Pixel_{i}"
    pixel.data.materials.append(screen_mat)
    pixels.append(pixel)

# Add neck joint (black rubber-like material)
bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.1, depth=0.1, location=(0, 0, 1.7))
neck = bpy.context.active_object
neck.name = "Neck"
neck.data.materials.append(dark_metal_mat)

# ----------------------------------------------------------------
# 4. Revised F.02-Style Torso
# ----------------------------------------------------------------
# Create slim main torso
bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.25, depth=0.6, location=(0, 0, 1.4))
torso_main = bpy.context.active_object
torso_main.name = "TorsoMain"
torso_main.scale = (1.0, 0.6, 1.0)  # Slim profile
# Add contour
bpy.ops.object.modifier_add(type='SIMPLE_DEFORM')
taper = torso_main.modifiers[-1]
taper.deform_method = 'TAPER'
taper.factor = 0.3
taper.deform_axis = 'Z'
torso_main.data.materials.append(white_mat)
add_edge_loops(torso_main, num_cuts=4)

# Add front panel with F.02 marking
bpy.ops.mesh.primitive_plane_add(size=0.4, location=(0, 0.15, 1.4))
front_panel = bpy.context.active_object
front_panel.name = "FrontPanel"
front_panel.scale = (0.8, 1.0, 1.0)
front_panel.data.materials.append(white_mat)

# Add waist joint (black rubber-like material)
bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.15, depth=0.1, location=(0, 0, 1.1))
waist = bpy.context.active_object
waist.name = "Waist"
waist.scale = (1.0, 0.6, 1.0)  # Match torso profile
waist.data.materials.append(dark_metal_mat)

# Add shoulder joints (more mechanical)
for side in [-1, 1]:
    # Main shoulder joint
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.1, depth=0.15,
                                      location=(0.3 * side, 0, 1.6))
    shoulder = bpy.context.active_object
    shoulder.name = f"Shoulder_{'R' if side > 0 else 'L'}"
    shoulder.rotation_euler.z = 1.5708  # Rotate to side
    shoulder.data.materials.append(white_mat)

    # Shoulder detail
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.06, depth=0.05,
                                      location=(0.35 * side, 0, 1.6))
    detail = bpy.context.active_object
    detail.name = f"ShoulderDetail_{'R' if side > 0 else 'L'}"
    detail.rotation_euler.z = 1.5708
    detail.data.materials.append(dark_metal_mat)

# ----------------------------------------------------------------
# 7. Realistic Shoulder Assembly (Boston Dynamics-style)
# ----------------------------------------------------------------
def create_shoulder_assembly(side=1):
    x_loc = 0.4 * side
    # Main joint housing
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.12, depth=0.2,
                                      location=(x_loc, 0, 1.45))
    housing = bpy.context.active_object
    housing.name = f"ShoulderHousing_{'R' if side>0 else 'L'}"
    housing.data.materials.append(white_mat)
    # Axle mechanism
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.04, depth=0.3,
                                      location=(x_loc, 0, 1.45))
    axle = bpy.context.active_object
    axle.rotation_euler.z = 1.5708  # Rotate axle orientation
    axle.data.materials.append(dark_metal_mat)
    # Hydraulic piston
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.02, depth=0.4,
                                      location=(x_loc + (-0.1*side), 0, 1.35))
    piston = bpy.context.active_object
    piston.rotation_euler.x = 0.4
    piston.data.materials.append(white_mat)

# ----------------------------------------------------------------
# 8. Industrial Robotic Arm (Segmented Design)
# ----------------------------------------------------------------
def create_arm(side=1):
    create_shoulder_assembly(side=side)
    # Upper arm (aluminum extrusion style)
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.08, depth=0.4,
                                      location=(0.4 * side, 0, 1.35))
    upper_arm = bpy.context.active_object
    upper_arm.name = f"UpperArm_{'R' if side>0 else 'L'}"
    upper_arm.rotation_euler.x = 0.3
    upper_arm.data.materials.append(white_mat)
    # Elbow joint with rotational mechanism
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, location=(0.4 * side, 0, 1.0))
    elbow = bpy.context.active_object
    elbow.scale.z = 0.6  # Flatten for mechanical look
    elbow.data.materials.append(dark_metal_mat)
    # Forearm with cable routing
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.06, depth=0.5,
                                      location=(0.4 * side, 0, 0.8))
    forearm = bpy.context.active_object
    forearm.rotation_euler.x = -0.2
    forearm.data.materials.append(white_mat)

# ----------------------------------------------------------------
# 9. Bipedal Leg System (Agility Robotics-style)
# ----------------------------------------------------------------
def create_leg(side=1):
    # Hip joint with active suspension
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.15, depth=0.1,
                                      location=(0.18 * side, 0, 0.6))
    hip = bpy.context.active_object
    hip.name = f"HipJoint_{'R' if side>0 else 'L'}"
    hip.data.materials.append(dark_metal_mat)
    # Thigh with actuator housing
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.1, depth=0.5,
                                      location=(0.18 * side, 0, 0.35))
    thigh = bpy.context.active_object
    thigh.rotation_euler.x = 0.1
    thigh.data.materials.append(metal_mat)
    # Knee with protective casing
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.12, depth=0.15,
                                      location=(0.18 * side, 0, 0.1))
    knee = bpy.context.active_object
    knee.data.materials.append(dark_metal_mat)
    # Shin with structural reinforcements
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.08, depth=0.6,
                                      location=(0.18 * side, 0, -0.25))
    shin = bpy.context.active_object
    shin.rotation_euler.x = -0.1
    shin.data.materials.append(metal_mat)
    # Ankle-foot assembly
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.1, depth=0.05,
                                      location=(0.18 * side, 0.1, -0.5))
    foot = bpy.context.active_object
    foot.rotation_euler.z = 0.2
    foot.data.materials.append(dark_metal_mat)

# ----------------------------------------------------------------
# 10. Professional-Grade Chest Display
# ----------------------------------------------------------------
# Reduced screen size with bezel
bpy.ops.mesh.primitive_plane_add(size=0.3, location=(0, 0.31, 1.45))
chest_screen = bpy.context.active_object
chest_screen.rotation_euler.x = 1.5708
# Add screen frame
bpy.ops.mesh.primitive_cube_add(size=0.1, location=(0, 0.3, 1.45))
frame = bpy.context.active_object
frame.scale = (0.35, 0.02, 0.25)
frame.data.materials.append(dark_metal_mat)

# Create the limbs
create_arm(side=1)  # Right arm
create_arm(side=-1)  # Left arm
create_leg(side=1)  # Right leg
create_leg(side=-1)  # Left leg

print("A humanoid robot with a two-part torso, waist pivot, and detailed assemblies has been created. The chest screen displays 'Fractal Robotics'.")
