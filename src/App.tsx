import React, { useRef, useState } from "react";

export default function App(){
    const [draging, setDraging] = useState(false);
    const [fileData, setFileData] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>)=>{
      e.preventDefault();
      e.stopPropagation();

      if(e.type === 'dragover'){
        setDraging(true);
      }else if(e.type === 'dragleave'){
        setDraging(false);
      }
  }

  const handleDrop = (e: React.DragEvent<HTMLInputElement>)=>{
    e.preventDefault();
    e.stopPropagation();
    setDraging(false);

    // Getting the list of dragged files
    const files = e.dataTransfer.files;
    // Check if there are any files
    if(files.length ){
        handleFiles(files);
    }
  }

  const handleFiles = (files: FileList)=>{
    // get valid images
    let validImgs = [...files].filter((file)=>
          ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)
        );

      for(const img of validImgs){
        // Initializing the file-reader API and reading the file.
        const reader = new FileReader();
        reader.readAsDataURL(img);

        reader.onloadend = ()=>{
          if(reader.result){
            setFileData((pre)=> [...pre, reader.result as string]);
          }
        }

      }
  }

  const handleSelection = ()=>{
    if(fileRef.current && fileRef.current.files){
      const files = fileRef.current.files;
      handleFiles(files);
    }
  }

  return(
    <main>
        <h1>Drag-and-Drop File Uploader</h1>
        <div 
            className={draging?"drop-area drag-over": "drop-area"}
            onDragEnter={handleDragDrop}
            onDragOver={handleDragDrop}
            onDragLeave={handleDragDrop}
            onDrop={handleDrop}
        >
          <h3 onClick={()=>fileRef.current?.click()} >
            <i className="fa-solid fa-file-arrow-up"></i>
          </h3>
          <h4 onClick={()=>fileRef.current?.click()} >
            Choose multiple imgages
         </h4>
          <p>or Drag and drop your Image file.</p>
        </div>
        <input 
            type="file" 
            id="file-input" 
            multiple hidden 
            ref={fileRef}
            onChange={handleSelection}
        />

        <div className="gallery">
          {(fileData.length === 0) && <p className="empty-gallery">Upload file to show</p> }
          {(fileData.length != 0) && (
            fileData.map((file, i)=>(
              <div className="image-box" key={i}>
                <img src={file} alt="img" />
              </div>
            ))
          )}
        </div>

    </main>
    
    );
}