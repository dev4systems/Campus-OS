import { useState } from "react";
import { libraryBooks } from "@/data/mockData";
import { Search, MapPin, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Library = () => {
  const [query, setQuery] = useState("");
  const filtered = query
    ? libraryBooks.filter((b) => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()) || b.isbn.includes(query))
    : libraryBooks;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Library</h1>
        <p className="text-sm text-muted-foreground">Search books, check availability & find locations</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by title, author, or ISBN..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 bg-muted/50" />
      </div>

      <div className="space-y-3">
        {filtered.map((book) => (
          <div key={book.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-4">
              <div className="h-16 w-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{book.title}</h3>
                  <Badge className={book.status === "available" ? "bg-status-success/10 text-status-success border-status-success/20" : "bg-status-danger/10 text-status-danger border-status-danger/20"}>
                    {book.status === "available" ? `Available (${book.quantity})` : `Due ${book.returnDate}`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>ISBN: {book.isbn}</span>
                  <span>{book.edition} Edition · {book.year}</span>
                  <span>{book.subject}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Room {book.room} · Stack {book.stack} · {book.shelf}</span>
                  <button className="ml-2 text-primary font-medium hover:underline">Get Directions</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">No books found</div>}
      </div>
    </div>
  );
};

export default Library;
