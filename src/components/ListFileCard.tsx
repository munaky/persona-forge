import { Button } from "@/components/ui/button";
import { getFileId } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";

interface ListFileCardProps {
  files: File[];
  setFiles: (files: any) => void;
}

export default function ListFileCard({ files, setFiles }: ListFileCardProps) {
  const handleDelete = (file: File) => {
    setFiles((prev: File[]) => prev.filter(f => getFileId(f) != getFileId(file)))
  }

  return (
    <div className="flex flex-col gap-1 p-2 rounded-md mb-2 bg-gray-800">
      {files.map((file) => (
        <div
          key={file.name}
          className="flex items-center justify-between gap-2 bg-gray-600 px-2 py-1 rounded"
        >
          <p className="text-right text-white text-sm w-full">{file.name}</p>
          <div
            onClick={() => handleDelete(file)}
            className="p-1 rounded bg-red-600 hover:bg-red-700">
            <Trash2Icon size={16} />
          </div>
        </div>
      ))}
    </div>
  );
};
