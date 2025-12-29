import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Button } from "../styles/app.style";
import { useRef } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { upload } from "@testing-library/user-event/dist/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "../services/user.service";

const validImgTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/avif",
];
const Profile = () => {
  const { user } = useSelector((state: RootState) => state.users);
  const imageRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", user?.userId],
    queryFn: async () => userService.getUserById(user?.userId || ""),
    enabled: !!user?.userId, // Only run if userId is available
    staleTime: Infinity, // Prevent refetching unless necessary
  });
  const uploadProfilePic = useMutation({
    mutationFn: async (formData: FormData) => userService.uploadPic(formData),
    onSuccess: () => {
      toast.success("Profile picture updated successfully!");
      // Invalidate the user query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["user", user?.userId],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to upload profile picture.",
      );
      console.error("Error uploading profile picture:", error);
    },
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type and size if necessary
    if (!validImgTypes.includes(file.type)) {
      toast.error(
        "Please upload a valid image file (png, jpeg, jpg, webp, avif).",
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size exceeds the limit of 5MB.");
      return;
    }
    const formData = new FormData();
    formData.append("profilePic", file);
    uploadProfilePic.mutateAsync(formData);
    if (imageRef.current) {
      imageRef.current.value = ""; // Clear the input after upload
    }
  };

  return (
    <div className="flex min-h-0 flex-grow justify-center overflow-y-auto">
      <div className="container h-full w-full bg-neutral-100 p-4 md:p-8">
        <h1 className="py-4 text-center text-3xl font-bold">Profile Page</h1>
        <div className="flex flex-col items-center justify-center">
          <div className="mx-auto mb-4 flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-gray-300">
            {userData?.profilePicUrl ? (
              <img
                src={new URL(
                  userData?.profilePicUrl,
                  process.env.REACT_APP_SERVER_URL,
                ).toString()}
                className="object-cover"
                alt="Profile"
              />
            ) : (
              <p className="text-sm italic text-neutral-700">
                No image available
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            className="px-4 py-2"
            onClick={() => imageRef.current?.click()}
          >
            Upload New Pic
          </Button>
          <input
            ref={imageRef}
            className="hidden"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
            onChange={handleImageChange}
          />
        </div>
        <div className="mx-auto mt-3 flex w-4/5 flex-col items-start justify-center md:mt-5">
          <div className="flex items-baseline gap-2 md:gap-5">
            <Label>Name :</Label>
            <p className="text-lg font-medium">
              {userData?.name || (
                <span className="text-base italic text-neutral-400">
                  "No Name Provided"
                </span>
              )}
            </p>
          </div>
          <div className="flex items-baseline gap-2 md:gap-5">
            <Label>Username :</Label>
            <p className="text-lg font-medium">
              {userData?.username || (
                <span className="text-base italic text-neutral-400">
                  "No username Provided"
                </span>
              )}
            </p>
          </div>
          <div className="flex items-baseline gap-2 md:gap-5">
            <Label>Email :</Label>
            <p className="text-lg font-medium">
              {userData?.email || (
                <span className="text-base italic text-neutral-400">
                  "No email Provided"
                </span>
              )}
            </p>
          </div>
          <div className="flex items-baseline gap-2 md:gap-5">
            <Label>Joined on :</Label>
            <p className="text-lg font-medium">
              {userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString()
                : ""}
            </p>
          </div>
        </div>
        {/* Add more profile related content here */}
      </div>
    </div>
  );
};

export default Profile;

const Label = styled.label`
  font-weight: 600;
  font-size: 1.2rem;
  color: #333;
  width: fit-content;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
