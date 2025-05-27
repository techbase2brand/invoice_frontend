import React, { useRef, useState } from "react"; 
import ImportCSVData from "./importcsv"; 

function ImportCSV() {
 

  return ( 
        <div className="flex flex-wrap">
                <div className="w-full px-4 mb-4 sm:mb-1">
                <ImportCSVData />
                </div>
            </div>  
  );
}

export default ImportCSV;
