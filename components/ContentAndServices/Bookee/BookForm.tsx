import { Book } from "./BookCard";

export default function BookForm({ instance }: { instance: Book | null }) {
  return (
    <>
      <p>This is a form to add or edit a book in Bookee</p>
      <span>Instance:: {instance?.title ?? ""}</span>
    </>
  );
}
