export const demoDocument = {
  filename: "Demo: Advanced Artificial Intelligence.pdf",
  total_slides: 24,
  raw_text: "Artificial Intelligence Overview. Machine Learning vs Deep Learning. Neural Networks explained...",
  summary: "This lecture provides a comprehensive overview of modern AI architectures, focusing on the evolution from traditional machine learning to large-scale transformer models.",
  key_points: [
    "Difference between Supervised and Unsupervised learning.",
    "The role of backpropagation in training neural networks.",
    "Why Transformers are superior for Natural Language Processing.",
    "Ethical considerations in AI deployment."
  ],
  topics: [
    "Introduction to AI",
    "Machine Learning Fundamentals",
    "Neural Network Architectures",
    "Natural Language Processing",
    "Future of AI"
  ],
  quiz: [
    {
      question: "What is the primary difference between Supervised and Unsupervised learning?",
      options: [
        { label: "A", text: "Supervised uses labeled data; Unsupervised uses unlabeled data." },
        { label: "B", text: "Unsupervised is faster than Supervised." },
        { label: "C", text: "Supervised requires more hardware." },
        { label: "D", text: "There is no difference." }
      ],
      correct_answer: "A",
      explanation: "Supervised learning relies on known input-output pairs to train models, while unsupervised learning finds patterns in raw data."
    },
    {
      question: "Which architecture is most commonly used for NLP today?",
      options: [
        { label: "A", text: "CNN" },
        { label: "B", text: "RNN" },
        { label: "C", text: "Transformers" },
        { label: "D", text: "Linear Regression" }
      ],
      correct_answer: "C",
      explanation: "Transformers have replaced RNNs for most NLP tasks due to their ability to process sequences in parallel via attention mechanisms."
    }
  ]
};
