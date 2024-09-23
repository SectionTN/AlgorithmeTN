interface CodeData {
  id: string;
  uid: string;
  title: string;
  first_name: string;
  last_name: string;
  description: string;
  language: string;
  code: string;
  instructions: string;
  level: string;
  section: string;
  likes: string[];
  views: number;
  comments: string[];
  bookmarksCount: number;
  isBookmarked: boolean;
}

interface InstructionsProps {
  codeId: string;
}

interface CodeProps {
  codeId: string;
}

export type {CodeData, CodeProps, InstructionsProps};
