export type User = {
  id: string;
  image: string;
  username: string;
  amount: number;
};

const user = [
  {
    id: "1",
    image: "@/assets/images/default-avatar.jpg",
    username: "123",
    amount: 1000,
  },
  {
    id: "2",
    image: "@/assets/images/default-avatar.jpg",
    username: "456",
    amount: 2000,
  },
  {
    id: "3",
    image: "@/assets/images/default-avatar.jpg",
    username: "789",
    amount: 3000,
  },
  {
    id: "4",
    image: "@/assets/images/default-avatar.jpg",
    username: "101112",
    amount: 4000,
  },
  {
    id: "5",
    image: "@/assets/images/default-avatar.jpg",
    username: "131415",
    amount: 5000,
  },
];

export default user;
