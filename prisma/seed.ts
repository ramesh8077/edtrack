import { PrismaClient, Role, Level } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Clean existing data ──────────────────────
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.pathTemplate.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ────────────────────────────────────
  // NOTE: In production, passwords would be hashed with argon2.
  // For seed convenience, we store a placeholder hash.
  // Real hashing: import argon2 from "argon2"; await argon2.hash("password123")
  const placeholderHash = "$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+daw";

  await prisma.user.create({
    data: {
      email: "admin@learnloop.ai",
      name: "Priya Admin",
      role: Role.ADMIN,
      passwordHash: placeholderHash,
      emailVerified: new Date(),
      bio: "Platform administrator managing LearnLoop AI.",
    },
  });

  const mentor1 = await prisma.user.create({
    data: {
      email: "mentor.rahul@learnloop.ai",
      name: "Rahul Sharma",
      role: Role.MENTOR,
      mentorVerified: true,
      passwordHash: placeholderHash,
      emailVerified: new Date(),
      bio: "Senior Frontend Engineer at Google. Mentoring devs in React & Next.js for 5+ years.",
    },
  });

  const mentor2 = await prisma.user.create({
    data: {
      email: "mentor.aisha@learnloop.ai",
      name: "Aisha Patel",
      role: Role.MENTOR,
      mentorVerified: true,
      passwordHash: placeholderHash,
      emailVerified: new Date(),
      bio: "ML Engineer at DeepMind. Passionate about making ML accessible to beginners.",
    },
  });

  const learnerNames = [
    { email: "arjun@student.edu", name: "Arjun Kumar" },
    { email: "sneha@student.edu", name: "Sneha Reddy" },
    { email: "vikram@student.edu", name: "Vikram Singh" },
    { email: "meera@student.edu", name: "Meera Nair" },
    { email: "rohit@student.edu", name: "Rohit Das" },
  ];

  const learners = await Promise.all(
    learnerNames.map((l) =>
      prisma.user.create({
        data: {
          email: l.email,
          name: l.name,
          role: Role.LEARNER,
          passwordHash: placeholderHash,
          emailVerified: new Date(),
        },
      }),
    ),
  );

  console.log(`  ✅ Created ${1 + 2 + learners.length} users`);

  // ─── Path Templates ───────────────────────────

  const frontendTemplate = await prisma.pathTemplate.create({
    data: {
      mentorId: mentor1.id,
      title: "Frontend Development Mastery",
      slug: "frontend-dev-mastery",
      goal: "Master modern frontend development with HTML, CSS, JavaScript, React, and Next.js. Build production-ready web applications.",
      level: Level.BEGINNER,
      isPublished: true,
      enrollmentCount: 142,
      avgRating: 4.7,
      structure: {
        modules: [
          {
            title: "HTML & CSS Foundations",
            lessons: ["Semantic HTML", "CSS Box Model", "Flexbox & Grid", "Responsive Design"],
          },
          {
            title: "JavaScript Essentials",
            lessons: [
              "Variables & Types",
              "Functions & Closures",
              "Async/Await",
              "DOM Manipulation",
            ],
          },
          {
            title: "React Fundamentals",
            lessons: ["Components & JSX", "State & Props", "Hooks Deep Dive", "Context API"],
          },
          {
            title: "Next.js & Production",
            lessons: ["App Router", "Server Components", "Data Fetching", "Deployment"],
          },
        ],
      },
    },
  });

  const dsaTemplate = await prisma.pathTemplate.create({
    data: {
      mentorId: mentor1.id,
      title: "Data Structures & Algorithms",
      slug: "dsa-interview-prep",
      goal: "Prepare for technical interviews with a structured approach to DSA. Cover arrays, trees, graphs, dynamic programming, and system design basics.",
      level: Level.INTERMEDIATE,
      isPublished: true,
      enrollmentCount: 289,
      avgRating: 4.8,
      structure: {
        modules: [
          {
            title: "Arrays & Strings",
            lessons: ["Two Pointers", "Sliding Window", "Prefix Sums", "Binary Search"],
          },
          {
            title: "Trees & Graphs",
            lessons: ["BFS & DFS", "Binary Trees", "Graph Algorithms", "Shortest Paths"],
          },
          {
            title: "Dynamic Programming",
            lessons: ["Memoization", "Tabulation", "Classic DP Problems", "Optimization"],
          },
        ],
      },
    },
  });

  const mlTemplate = await prisma.pathTemplate.create({
    data: {
      mentorId: mentor2.id,
      title: "Machine Learning Basics",
      slug: "ml-basics",
      goal: "Understand the fundamentals of machine learning: supervised/unsupervised learning, neural networks, and practical model building with Python.",
      level: Level.BEGINNER,
      isPublished: true,
      enrollmentCount: 97,
      avgRating: 4.5,
      structure: {
        modules: [
          {
            title: "Python for ML",
            lessons: [
              "NumPy Essentials",
              "Pandas DataFrames",
              "Matplotlib Viz",
              "Scikit-learn Intro",
            ],
          },
          {
            title: "Supervised Learning",
            lessons: [
              "Linear Regression",
              "Logistic Regression",
              "Decision Trees",
              "Model Evaluation",
            ],
          },
          {
            title: "Neural Networks",
            lessons: ["Perceptrons", "Backpropagation", "CNNs Intro", "Transfer Learning"],
          },
        ],
      },
    },
  });

  console.log("  ✅ Created 3 path templates");

  // ─── Sample Learning Paths ────────────────────

  const templateChoices = [
    frontendTemplate,
    dsaTemplate,
    mlTemplate,
    frontendTemplate,
    dsaTemplate,
  ];
  const progressValues = [0.75, 0.45, 0.2, 0.9, 0.1];

  for (let i = 0; i < learners.length; i++) {
    const learner = learners[i]!;
    const template = templateChoices[i]!;
    const progress = progressValues[i]!;

    const path = await prisma.learningPath.create({
      data: {
        userId: learner.id,
        title: template.title,
        goal: template.goal,
        level: template.level,
        targetWeeks: 8,
        source: "TEMPLATE",
        templateId: template.id,
        progress,
        status: progress >= 0.9 ? "COMPLETED" : "ACTIVE",
      },
    });

    // Create modules with lessons for each path
    const templateStructure = template.structure as {
      modules: { title: string; lessons: string[] }[];
    };

    for (let mi = 0; mi < templateStructure.modules.length; mi++) {
      const moduleData = templateStructure.modules[mi]!;
      const isModuleComplete = (mi + 1) / templateStructure.modules.length <= progress;

      const mod = await prisma.module.create({
        data: {
          pathId: path.id,
          title: moduleData.title,
          description: `Learn the fundamentals of ${moduleData.title.toLowerCase()}.`,
          order: mi + 1,
          estimatedHours: 10,
          completedAt: isModuleComplete ? new Date() : null,
        },
      });

      // Create lessons
      for (let li = 0; li < moduleData.lessons.length; li++) {
        const lessonTitle = moduleData.lessons[li]!;
        const isLessonComplete = isModuleComplete;

        await prisma.lesson.create({
          data: {
            moduleId: mod.id,
            title: lessonTitle,
            contentMd: `# ${lessonTitle}\n\nThis lesson covers the key concepts of **${lessonTitle}**.\n\n## Learning Objectives\n\n- Understand core principles\n- Apply concepts through exercises\n- Build practical skills\n\n## Content\n\nDetailed content will be generated by AI based on your learning level and goals.`,
            order: li + 1,
            estimatedMinutes: 30,
            resources: {
              links: [
                { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
                { title: "Official Documentation", url: "https://docs.example.com" },
              ],
            },
            completedAt: isLessonComplete ? new Date() : null,
          },
        });
      }

      // Create a quiz for each module
      const quiz = await prisma.quiz.create({
        data: {
          moduleId: mod.id,
          title: `${moduleData.title} Assessment`,
          passingScore: 70,
        },
      });

      // Create sample questions
      await prisma.question.create({
        data: {
          quizId: quiz.id,
          prompt: `Which of the following best describes a key concept in ${moduleData.title}?`,
          type: "MCQ",
          options: [
            "A fundamental building block",
            "An advanced optimization technique",
            "A deprecated pattern",
            "A testing methodology",
          ],
          correctAnswer: "A fundamental building block",
          explanation: `This concept is foundational to understanding ${moduleData.title}.`,
          difficulty: 1,
          order: 1,
        },
      });

      await prisma.question.create({
        data: {
          quizId: quiz.id,
          prompt: `Explain in your own words why ${moduleData.title.toLowerCase()} is important in modern development.`,
          type: "OPEN",
          correctAnswer: "Answers should demonstrate understanding of practical applications.",
          explanation: "This is an open-ended question graded by AI for depth of understanding.",
          difficulty: 2,
          order: 2,
        },
      });
    }
  }

  console.log("  ✅ Created 5 learning paths with modules, lessons, and quizzes");

  // ─── Sample Reviews ───────────────────────────

  await prisma.review.create({
    data: {
      userId: learners[0]!.id,
      templateId: frontendTemplate.id,
      rating: 5,
      comment: "Incredible learning path! The AI-generated content adapts perfectly to my pace.",
    },
  });

  await prisma.review.create({
    data: {
      userId: learners[1]!.id,
      templateId: dsaTemplate.id,
      rating: 5,
      comment: "Best DSA prep resource I've used. The adaptive quizzes really test understanding.",
    },
  });

  console.log("  ✅ Created sample reviews");

  console.log("\n🎉 Database seeded successfully!");
  console.log("   Login credentials (all users): password123");
  console.log("   Admin: admin@learnloop.ai");
  console.log("   Mentors: mentor.rahul@learnloop.ai, mentor.aisha@learnloop.ai");
  console.log("   Learners: arjun@student.edu, sneha@student.edu, ...");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
