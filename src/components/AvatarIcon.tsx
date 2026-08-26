"use client";

import React from "react";
import * as Icons from "lucide-react";

interface AvatarIconProps {
  name: string;
  className?: string;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ name, className }) => {
  // @ts-ignore
  const IconComponent = Icons[name] || Icons.User;
  return <IconComponent className={className || "w-5 h-5"} />;
};
