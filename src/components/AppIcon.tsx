import React from "react";
import { 
  Code2, 
  Terminal, 
  Chrome, 
  Folder, 
  Music, 
  Settings, 
  Power, 
  Search,
  AlertCircle
} from "lucide-react";

interface AppIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, className = "", size = 20 }) => {
  switch (name) {
    case "Code2":
      return <Code2 className={className} size={size} />;
    case "Terminal":
      return <Terminal className={className} size={size} />;
    case "Chrome":
      return <Chrome className={className} size={size} />;
    case "Folder":
      return <Folder className={className} size={size} />;
    case "Music":
      return <Music className={className} size={size} />;
    case "Settings":
      return <Settings className={className} size={size} />;
    case "Power":
      return <Power className={className} size={size} />;
    case "Search":
      return <Search className={className} size={size} />;
    default:
      return <AlertCircle className={className} size={size} />;
  }
};
