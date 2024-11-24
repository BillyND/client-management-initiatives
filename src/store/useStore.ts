import { create } from "zustand";

interface Initiative {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  initiativeName: string;
  problem: string;
  goal: string;
  method: string;
  expectedResult: string;
  status: string;
  scores?: {
    creativity: number;
    feasibility: number;
    effectiveness: number;
    scalability: number;
  };
  totalScore?: number;
}

interface User {
  id: string;
  username: string;
  role: "admin" | "manager" | "secretary" | "evaluator" | "user";
}

interface StoreState {
  initiatives: Initiative[];
  addInitiative: (initiative: Initiative) => void;
  updateInitiative: (id: string, updates: Partial<Initiative>) => void;
  user: User | null;
}

const useStore = create<StoreState>((set) => ({
  user: {
    id: "",
    username: "",
    role: "evaluator",
  },
  initiatives: [
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@school.edu.vn",
      department: "Khoa Toán",
      position: "Giáo viên",
      initiativeName: "Phương pháp giảng dạy toán học tương tác",
      problem: "Học sinh thiếu hứng thú với môn toán",
      goal: "Tăng sự tham gia và hiểu biết của học sinh trong giờ toán",
      method: "Sử dụng các trò chơi và bài tập tương tác",
      expectedResult: "Cải thiện điểm số và thái độ học tập của học sinh",
      status: "pending",
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "tranthib@school.edu.vn",
      department: "Khoa Văn",
      position: "Trưởng khoa",
      initiativeName: "Câu lạc bộ văn học sáng tạo",
      problem: "Thiếu không gian cho học sinh phát triển năng khiếu văn học",
      goal: "Tạo môi trường cho học sinh yêu thích văn học phát triển",
      method: "Tổ chức các buổi sinh hoạt câu lạc bộ định kỳ",
      expectedResult:
        "Học sinh có thêm sân chơi bổ ích và cải thiện kỹ năng viết",
      status: "pending",
    },
  ],
  addInitiative: (initiative) =>
    set((state) => ({ initiatives: [...state.initiatives, initiative] })),
  updateInitiative: (id, updates) =>
    set((state) => ({
      initiatives: state.initiatives.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    })),
}));

export default useStore;
