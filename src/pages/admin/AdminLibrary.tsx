import { libraryBooks } from "@/data/mockData";
import { BookOpen, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const AdminLibrary = () => {
  const [query, setQuery] = useState("");
  const filtered = query ? libraryBooks.filter((b) => b.title.toLowerCase().includes(query.toLowerCase())) : libraryBooks;
  const totalBooks = libraryBooks.reduce((s, b) => s + b.quantity, 0);
  const checkedOut = libraryBooks.filter((b) => b.status === "checked_out").length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Library Management</h1>
          <p className="text-sm text-muted-foreground">{libraryBooks.length} titles · {totalBooks} copies</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Book</Button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-lg font-bold text-foreground">{libraryBooks.length}</p>
          <p className="text-xs text-muted-foreground">Total Titles</p>
        </div>
        <div className="rounded-xl border border-status-success/20 bg-status-success/5 p-4 text-center">
          <p className="text-lg font-bold text-status-success">{totalBooks}</p>
          <p className="text-xs text-muted-foreground">Available Copies</p>
        </div>
        <div className="rounded-xl border border-status-warning/20 bg-status-warning/5 p-4 text-center">
          <p className="text-lg font-bold text-status-warning">{checkedOut}</p>
          <p className="text-xs text-muted-foreground">Checked Out</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search books..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10 bg-muted/50" />
      </div>

      <div className="space-y-3">
        {filtered.map((book) => (
          <div key={book.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author} · ISBN: {book.isbn} · {book.room}, {book.stack}</p>
              </div>
            </div>
            <Badge className={book.status === "available" ? "bg-status-success/10 text-status-success" : "bg-status-danger/10 text-status-danger"}>
              {book.status === "available" ? `${book.quantity} avail` : "Out"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLibrary;
