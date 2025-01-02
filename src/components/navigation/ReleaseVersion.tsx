import React from 'react';
import { Badge } from "@/components/ui/badge";

const ReleaseVersion = () => {
  // This value will be automatically injected during the build process
  // Format: MAJOR.MINOR.PATCH (e.g., 1.0.1)
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';
  
  return (
    <Badge variant="outline" className="ml-2">
      v{version}
    </Badge>
  );
};

export default ReleaseVersion;