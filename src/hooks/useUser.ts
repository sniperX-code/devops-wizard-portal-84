
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, UpdateUserRequest, UserDetailsResponse } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';

export function useUserDetails() {
  return useQuery({
    queryKey: ['user', 'details'],
    queryFn: () => UserService.getUserDetails(),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => UserService.updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'details'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
