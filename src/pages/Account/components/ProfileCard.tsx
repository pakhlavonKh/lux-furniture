// src/pages/Account/components/ProfileCard.tsx

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Props {
  user?: User;
}

export default function ProfileCard({ user }: Props) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async () => {
      return apiFetch("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({ name, phone }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  return (
    <div className="bg-card rounded-2xl shadow-[var(--shadow-soft)] p-12">

      <div className="space-y-8">

        <div>
          <label className="text-caption block mb-3">
            Full Name
          </label>
          <input
            className="w-full bg-transparent border-b border-border py-3 outline-none focus:border-foreground transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-caption block mb-3">
            Phone Number
          </label>
          <input
            className="w-full bg-transparent border-b border-border py-3 outline-none focus:border-foreground transition-colors"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="btn-luxury w-full mt-6"
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
}