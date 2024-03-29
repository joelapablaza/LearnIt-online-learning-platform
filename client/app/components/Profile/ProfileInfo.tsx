import React, { FC, useState, useRef, useEffect } from "react";
import { styles } from "../../../app/styles/style";
import Image from "next/image";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assets/avatar.png";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";
import User from "@/app/interfaces/User";
import Loader from "../Loader/Loader";

type Props = {
  avatar: string | null;
  user: User;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [updateAvatar, { isSuccess: isSuccessUpdateAvatar, error }] =
    useUpdateAvatarMutation();

  const [
    editProfile,
    { isSuccess: isSuccessUpdateInfo, error: errorUpdateInfo },
  ] = useEditProfileMutation();

  // Solicitar Usuario al Back
  const {
    data: userData,
    isLoading,
    isSuccess: isSuccessGetUser,
    refetch,
  } = useLoadUserQuery(undefined, { refetchOnMountOrArgChange: true });

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (isSuccessUpdateAvatar || isSuccessUpdateInfo) {
      refetch();
    }
    if (error || errorUpdateInfo) {
      console.log(error);
    }
    if (isSuccessUpdateInfo) {
      toast.success("Perfil actualizado exitosamente");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccessUpdateAvatar,
    error,
    isSuccessUpdateInfo,
    errorUpdateInfo,
    isSuccessGetUser,
    userData,
  ]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({ name: name });
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full flex justify-center">
            <div className="relative" onClick={openFileInput}>
              <Image
                src={
                  userData?.user?.avatar?.url
                    ? userData?.user?.avatar?.url
                    : "/assets/avatar.png"
                }
                alt="avatar"
                className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
                width={120}
                height={120}
              />
              <input
                type="file"
                ref={fileInputRef}
                name=""
                id="avatar"
                className="hidden"
                onChange={imageHandler}
                accept="image/png,image/jpg,image/jpeg,image/webp"
              />
              <label htmlFor="avatar">
                <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                  <AiOutlineCamera size={20} className="z-1" />
                </div>
              </label>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full pl-6 800px:pl-10">
            <form onSubmit={handleSubmit}>
              <div className="800px:w-[50%] m-auto block pb-4">
                <div className="w-[100%]">
                  <label className="block pb-2">Nombre Completo</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 bg-white dark:bg-slate-900 `}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-[100%] pt-2">
                  <label className="block pb-2">Dirección Email</label>
                  <input
                    type="text"
                    readOnly
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0 bg-white dark:bg-slate-900 `}
                    required
                    value={userData?.user?.email}
                  />
                </div>
                <input
                  className="w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer"
                  required
                  value="Actualizar"
                  type="submit"
                />
              </div>
            </form>
            <br />
          </div>
        </>
      )}
    </>
  );
};

export default ProfileInfo;
