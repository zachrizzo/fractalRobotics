import { createAIBlogPost } from "./ai-blog-manager";

async function testBlogCreation() {
  try {
    await createAIBlogPost(
      "The Future of Robotics: AI-Driven Automation",
      "Robotics technology is rapidly evolving, driven by advances in artificial intelligence and machine learning. This transformation is reshaping how we think about automation and human-robot interaction.\n\nIn this post, we explore the latest developments in robotics, from collaborative robots (cobots) to autonomous systems, and how they are revolutionizing industries from manufacturing to healthcare.\n\nKey areas we'll discuss include:\n- Advanced sensor integration\n- Real-time decision making\n- Safety protocols\n- Human-robot collaboration",
      "Technology",
      ["Robotics", "AI", "Automation", "Future Tech"],
      "/images/robot-future.jpg"
    );
    console.log("Blog post created successfully!");
  } catch (error) {
    console.error("Error creating blog post:", error);
  }
}

testBlogCreation();
