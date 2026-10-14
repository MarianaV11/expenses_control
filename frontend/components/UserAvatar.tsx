import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name?: string;
  src?: string;
  className?: string;
}

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (words[0][0] + last).toUpperCase();
};

const UserAvatar = ({ name, src, className }: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      {src && <AvatarImage src={src} alt={name} className="object-cover" />}
      <AvatarFallback className="bg-primary/15 text-primary font-medium text-[length:inherit]">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
