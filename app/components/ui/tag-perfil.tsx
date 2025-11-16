import * as React from "react";

import {Users} from "lucide-react";


const TagPerfil = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (
    <div className="flex items-center gap-2 text-secondary bg-tag-background dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">
        <Users className="w-4 h-4 text-primary dark:text-gray-300" />
        <span>Prof.Leonardo</span>
    </div>  
    );
}
    
export default TagPerfil;