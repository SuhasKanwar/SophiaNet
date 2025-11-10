import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import FileIconTag from "@/components/chat/FileIconTag";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const updated = [...prevFiles, ...newFiles];
      return updated;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFileAt = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (onChange) {
      onChange(files);
    }
  }, [files, onChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <div
      className="w-full min-h-[calc(100vh-var(--navbar-height,120px))] flex items-center justify-center"
      {...getRootProps()}
    >
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden min-h-[calc(100vh-var(--navbar-height,120px))]"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 mt-[30vh] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col min-h-full items-center justify-center mt-[20vh]">
          <p className="relative z-20 font-sans font-bold text-neutral-300 text-base">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 text-base mt-2">
            Drag or drop your files here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            <AnimatePresence initial={false}>
              {files.length > 0 &&
                files.map((file, idx) => (
                  <motion.div key={"file" + idx} layout className="mt-4">
                    <FileIconTag
                      name={file.name}
                      sizeBytes={file.size}
                      mimeType={file.type}
                      lastModified={file.lastModified}
                      variant="card"
                      // Important: prevent bubbling to the clickable container
                      stopClickPropagation
                      onRemove={() => removeFileAt(idx)}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>

            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-neutral-900 flex items-center justify-center h-32 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 14;
  const cellSize = 40;
  const gap = 1;
  const total = rows * columns;

  return (
    <div
      className="bg-neutral-900 shrink-0"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
        gap: `${gap}px`,
        justifyContent: "center",
      }}
    >
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`flex shrink-0 rounded-[2px] ${
            idx % 2 === 0
              ? "bg-neutral-950"
              : "bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
          }`}
          style={{ width: cellSize, height: cellSize }}
        />
      ))}
    </div>
  );
}