import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import defaultAvatar from "../../../public/assets/avatar.png";
import { VscSend, VscVerifiedFilled } from "react-icons/vsc";
import toast from "react-hot-toast";
import {
  courseApi,
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCorseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import { format } from "timeago.js";
import { BiMessage } from "react-icons/bi";

import socketIO from "socket.io-client";
import Loader from "../Loader/Loader";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
  data: CursoInfo[];
  user: any;
  refetch: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
};

interface CursoInfo {
  videoUrl: string;
  title: string;
  videoSection: string;
  description: string;
  videoLength: number;
  links: Link[];
  suggestion: string;
  _id: string;
  questions: any[];
}

interface Link {
  title: string;
  url: string;
}

const CourseContentMedia: FC<Props> = ({
  data,
  id,
  user,
  refetch,
  activeVideo,
  setActiveVideo,
}) => {
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [reviewReply, setReviewReply] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [reviewId, setReviewId] = useState("");

  const {
    data: courseData,
    refetch: courseRefetch,
    isLoading,
  } = useGetCourseDetailsQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const course = courseData?.course;

  const [
    addNewQuestion,
    { isSuccess, isLoading: LoadingWhileCreatingNewQueston, error },
  ] = useAddNewQuestionMutation({});

  const [
    addAnswerToQuestion,
    {
      isSuccess: answerSuccess,
      isLoading: answerCreationLoading,
      error: answerCreationError,
    },
  ] = useAddAnswerInQuestionMutation({});

  const [
    addReviewToCourse,
    {
      isSuccess: addReviewSuccess,
      isLoading: loadingWhileAddingReview,
      error: errorWhileAddingReview,
    },
  ] = useAddReviewInCorseMutation({});

  const [
    addReplyToReview,
    {
      isSuccess: replyToReviewSuccess,
      isLoading: loadingWhileReplyToReview,
      error: errorWhileReplyToReview,
    },
  ] = useAddReplyInReviewMutation({});

  const isReviewExists = course?.reviews?.find(
    (item: any) => item.user._id === user._id
  );

  const handleQuestionSubmit = (e: any) => {
    if (question.length === 0) {
      toast.error("Por favor, completa el campo de la pregunta");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data?.[activeVideo]._id,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
      toast.success("Tu pregunta se añadió correctamente");
      socketId.emit("notification", {
        userId: user._id,
        title: "Nueva Pregunta Recibida",
        message: `Tienes una nueva pregunta en ${data?.[activeVideo].title} !`,
      });
    }
    if (answerSuccess) {
      setAnswer("");
      refetch();
      toast.success("Tu respuesta se añadió correctamente");
      if (user.role !== "admin") {
        socketId.emit("notification", {
          userId: user._id,
          title: "Nueva respuesta recibida",
          message: `Tu pregunta en el curso: ${data?.[activeVideo].title}, ¡ha recibido una nueva respuesta!`,
        });
      }
    }
    if (addReviewSuccess) {
      setReview("");
      setRating(1);
      courseRefetch();
      toast.success("Tu reseña se agregó correctamente");
      socketId.emit("notification", {
        userId: user._id,
        title: "Nueva Review Recibida",
        message: `${user?.name} ha añadido una reseña en ${course?.name}`,
      });
    }
    if (replyToReviewSuccess) {
      setReviewReply("");
      refetch();
      toast.success("Tu respuesta a la reseña se añadió correctamente");
    }
    if (error) {
      if ("data" in error) {
        const errMsg = error as any;
        toast.error(errMsg.data.message);
      }
    }
    if (answerCreationError) {
      if ("data" in answerCreationError) {
        const errMsg = error as any;
        toast.error(errMsg.data.message);
      }
    }

    if (errorWhileAddingReview && "data" in errorWhileAddingReview) {
      const errorData = errorWhileAddingReview.data as { message: string };
      toast.error(errorData.message);
    }

    if (errorWhileReplyToReview && "data" in errorWhileReplyToReview) {
      const errorData = errorWhileReplyToReview.data as { message: string };
      toast.error(errorData.message);
    }
  }, [
    refetch,
    courseRefetch,
    isSuccess,
    answerSuccess,
    error,
    answerCreationError,
    addReviewSuccess,
    errorWhileAddingReview,
    replyToReviewSuccess,
    errorWhileReplyToReview,
  ]);

  const handleReplySubmit = () => {
    addAnswerToQuestion({
      answer,
      courseId: id,
      questionId: questionId,
      contentId: data?.[activeVideo]._id,
    });
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Por favor, completa el campo de la reseña");
    } else {
      addReviewToCourse({
        review,
        rating,
        courseId: id,
        avatar: user.avatar.url,
      });
    }
  };

  const handleReviewReplySubmit = async () => {
    if (!loadingWhileReplyToReview) {
      if (reviewReply.length === 0) {
        toast.error("Por favor, completa el campo de la respuesta");
      } else {
        addReplyToReview({
          reviewId,
          courseId: id,
          reviewReply,
        });
      }
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={data?.[activeVideo]?.title}
        videoUrl={data?.[activeVideo]?.videoUrl}
      />
      <div className="w-full flex items-center justify-between my-3 ">
        <div
          className={`${
            styles.button
          } !w-[unset] !min-h-[40px] !py-[unset] items-center text-white ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" /> Prev Lesson
        </div>
        <div
          className={`${
            styles.button
          } !w-[unset] !min-h-[40px] !py-[unset] items-center text-white ${
            activeVideo === 0 && "!cursor-pointer opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1
            )
          }
        >
          Next Lesson <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>
      <h1 className="pt-2 text-[25px] font-[600] text-black dark:text-white">
        {data?.[activeVideo].title}
      </h1>
      <br />
      <div className="w-full py-4 px-5 flex items-center justify-between bg-slate-500 bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((item, index) => (
          <h5
            className={`800px:text-[20px] px-5 text-black dark:text-white cursor-pointer ${
              activeBar === index && "!text-red-500"
            }`}
            key={index}
            onClick={() => setActiveBar(index)}
          >
            {item}
          </h5>
        ))}
      </div>
      <br />

      {activeBar === 0 && (
        <p className="text-[18px] whitespace-pre-line mb-3 text-black dark:text-white">
          {data?.[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div className="ml-5">
          {data?.[activeVideo]?.links.map((item: any, index: number) => (
            <>
              <div className="mb-5">
                <h2 className="800px:text-20px 800px:inline-block text-black dark:text-white ">
                  {item.title && item.title + " : "}
                </h2>
                <a
                  href={item.url}
                  className="inline-block text-[#4395c4] 800px:text-[20px] 800:pl-2 pl-2"
                >
                  {item.url}
                </a>
              </div>
            </>
          ))}
        </div>
      )}

      {activeBar === 2 && (
        <>
          <div className="w-full flex text-black dark:text-white">
            <Image
              src={user.avatar ? user.avatar.url : defaultAvatar}
              width={50}
              height={50}
              alt="avatar"
              style={{ objectFit: "contain" }}
              className="rounded-full w-[50px] h-[50px] object-contain"
            />
            <div className="relative w-full ml-3">
              <textarea
                name=""
                id=""
                cols={40}
                rows={5}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Write your question here..."
                className="outline-none bg-transparent border dark:border-[#ffffff57] border-[#68686842] w-full p-2 rounded 800px:text-[18px] font-Poppins"
              />
              <div className="absolute bottom-0 right-0 mb-2 mr-2">
                <div
                  className={`p-2 cursor-pointer ${
                    LoadingWhileCreatingNewQueston && "cursor-no-drop"
                  }`}
                  onClick={
                    LoadingWhileCreatingNewQueston
                      ? () => {}
                      : handleQuestionSubmit
                  }
                >
                  <VscSend size={25} />
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="w-full h-[1px] dark:bg-[#ffffff3b] bg-[#68686842]" />
          <div>
            <ComposeReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleReplySubmit={handleReplySubmit}
              questionId={questionId}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        </>
      )}

      {activeBar === 3 && (
        <div className="w-full">
          <>
            {!isReviewExists && (
              <>
                <div className="w-full flex">
                  <Image
                    src={user.avatar ? user.avatar.url : defaultAvatar}
                    width={50}
                    height={50}
                    alt="avatar"
                    style={{ objectFit: "contain" }}
                    className="rounded-full w-[50px] h-[50px] object-contain"
                  />
                  <div className="w-full">
                    <h5 className="pl-3 text-[20px] font-[500] text-black dark:text-white">
                      Dar tu calificación{" "}
                      <span className="text-red-500">*</span>
                    </h5>

                    <div className="flex w-full ml-2 pb-3">
                      {[1, 2, 3, 4, 5].map((i) =>
                        rating >= i ? (
                          <AiFillStar
                            key={i}
                            size={25}
                            color=" rgb(246, 186, 0) "
                            className="ml-1 cursor-pointer"
                            onClick={() => setRating(i)}
                          />
                        ) : (
                          <AiOutlineStar
                            key={i}
                            size={25}
                            color=" rgb(246, 186, 0) "
                            className="ml-1 cursor-pointer"
                            onClick={() => setRating(i)}
                          />
                        )
                      )}
                    </div>
                    <div className="relative w-full ml-3">
                      <textarea
                        name=""
                        id=""
                        cols={40}
                        rows={5}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Write your review here..."
                        className="outline-none bg-transparent border dark:border-[#ffffff57] border-[#68686842] w-full p-2 rounded 800px:text-[18px] font-Poppins text-black dark:text-white"
                      />
                      <div className="absolute bottom-0 right-0 mb-2 mr-2">
                        <div
                          className={`p-2 cursor-pointer ${
                            loadingWhileAddingReview && "cursor-no-drop"
                          }`}
                          onClick={
                            loadingWhileAddingReview
                              ? () => {}
                              : handleReviewSubmit
                          }
                        >
                          <VscSend size={25} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <br />
            <div className="w-full h-[1px] dark:bg-[#ffffff3b] bg-[#68686842]" />
            <div className="w-full">
              {(course?.reviews && [...course.reviews].reverse()).map(
                (item: any, index: number) => (
                  <>
                    <div className="w-full my-5">
                      <div className="w-full flex text-black dark:text-white">
                        <Image
                          src={item.avatar ? item.avatar : defaultAvatar}
                          width={50}
                          height={50}
                          alt="avatar"
                          style={{ objectFit: "contain" }}
                          className="rounded-full w-[50px] h-[50px] object-contain"
                        />
                        <div className="ml-3 text-black dark:text-white">
                          <h1 className="text-[20px] ">{item?.user.name}</h1>
                          <Ratings rating={item.rating} />

                          <p>{item?.comment}</p>
                          <small className="text-[#000000b8] dark:text-[#ffffff83]">
                            {format(item?.createdAt)} {"•"}
                          </small>
                        </div>
                      </div>

                      {user.role === "admin" &&
                        item.commentReplies.length === 0 && (
                          <span
                            className={`${styles.label} cursor-pointer float-left mb-4 mt-2 ml-[60px]`}
                            onClick={() => {
                              setIsReviewReply(true), setReviewId(item._id);
                            }}
                          >
                            Responder
                          </span>
                        )}

                      {isReviewReply && reviewId === item._id && (
                        <div className="flex w-full relative">
                          <textarea
                            cols={40}
                            rows={1}
                            placeholder="Añadir comentario"
                            value={reviewReply}
                            onChange={(e) => setReviewReply(e.target.value)}
                            className=" text-black dark:text-white block 800px:ml-10  outline-none bg-transparent border-b dark:border-[#ffffff57] border-[#68686842] p-[5px] w-[90%]"
                          />
                          <button
                            type="submit"
                            disabled={
                              reviewReply === "" || loadingWhileReplyToReview
                            }
                            className={`${
                              reviewReply === ""
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            } p-2  text-black dark:text-white`}
                            onClick={handleReviewReplySubmit}
                          >
                            <VscSend size={25} />
                          </button>
                        </div>
                      )}

                      {item.commentReplies.map((i: any, index: number) => (
                        <>
                          <div
                            className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
                            key={index}
                          >
                            <div>
                              <Image
                                src={
                                  i.user.avatar
                                    ? i.user.avatar.url
                                    : defaultAvatar
                                }
                                width={50}
                                height={50}
                                alt="avatar"
                                style={{ objectFit: "contain" }}
                                className="rounded-full w-[30px] h-[30px] object-contain"
                              />
                            </div>
                            <div className="pl-3 text-black dark:text-white">
                              <div className="flex items-center">
                                <h5 className="text-[20px] mr-1">
                                  {i?.user.name}
                                </h5>
                                {i.user.role === "admin" && (
                                  <VscVerifiedFilled
                                    fill="#4c68d7 "
                                    className="mb-2"
                                  />
                                )}
                              </div>
                              <p>{i?.reviewReply}</p>
                              <small className="text-[#000000b8] dark:text-[#ffffff83]">
                                {format(i?.createdAt)} {"•"}
                              </small>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
          </>
        </div>
      )}
    </div>
  );
};

const ComposeReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleReplySubmit,
  questionId,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {data?.[activeVideo].questions.map((item: any, index: number) => (
          <ReplyItem
            key={index}
            item={item}
            answer={answer}
            setAnswer={setAnswer}
            questionId={questionId}
            setQuestionId={setQuestionId}
            handleReplySubmit={handleReplySubmit}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};

const ReplyItem = ({
  item,
  answer,
  setAnswer,
  questionId,
  setQuestionId,
  handleReplySubmit,
  answerCreationLoading,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);
  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
          <Image
            src={item.user.avatar ? item.user.avatar.url : defaultAvatar}
            width={50}
            height={50}
            alt="avatar"
            style={{ objectFit: "contain" }}
            className="rounded-full w-[30px] h-[30px] object-contain"
          />
          <div className="pl-3 text-black dark:text-white">
            <h5 className="text-[20px]">{item?.user.name}</h5>
            <p>{item?.question}</p>
            <small className="text-[#000000b8] dark:text-[#ffffff83]">
              {format(item?.createdAt)} {"•"}
            </small>
          </div>
        </div>

        <div className="w-full flex">
          <span
            className="800px:pl-16 mr-2 cursor-pointer text-[#000000b8] dark:text-[#ffffff83]"
            onClick={() => {
              setReplyActive(!replyActive), setQuestionId(item._id);
            }}
          >
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "All Replies"
                : "Add Reply"
              : "Hide Reply"}
          </span>
          <BiMessage
            size={20}
            className="cursor-pointer text-[#000000b8] dark:text-[#ffffff83]"
          />
          <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] dark:text-[#ffffff83]">
            {item?.questionReplies.length}
          </span>
        </div>

        {replyActive && questionId === item._id && (
          <>
            {item?.questionReplies.map((item: any, index: number) => (
              <div
                className="w-full flex 800px:ml-16 my-5 text-black dark:text-white"
                key={index}
              >
                <div>
                  <Image
                    src={
                      item.user.avatar ? item.user.avatar.url : defaultAvatar
                    }
                    width={50}
                    height={50}
                    alt="avatar"
                    style={{ objectFit: "contain" }}
                    className="rounded-full w-[30px] h-[30px] object-contain"
                  />
                </div>
                <div className="pl-3 text-black dark:text-white">
                  <div className="flex items-center">
                    <h5 className="text-[20px] mr-1">{item?.user.name}</h5>
                    {item.user.role === "admin" && (
                      <VscVerifiedFilled fill="#4c68d7 " className="mb-2" />
                    )}
                  </div>
                  <p>{item?.answer}</p>
                  <small className="text-[#000000b8] dark:text-[#ffffff83]">
                    {format(item?.createdAt)} {"•"}
                  </small>
                </div>
              </div>
            ))}

            <>
              <div className="flex w-full relative">
                <textarea
                  cols={40}
                  rows={1}
                  placeholder="Enter your reply"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className=" text-black dark:text-white block 800px:ml-10  outline-none bg-transparent border-b dark:border-[#ffffff57] border-[#68686842] p-[5px] w-[90%]"
                />
                <button
                  type="submit"
                  disabled={answer === "" || answerCreationLoading}
                  className={`${
                    answer === "" ? "cursor-not-allowed" : "cursor-pointer"
                  } p-2  text-black dark:text-white`}
                  onClick={handleReplySubmit}
                >
                  <VscSend size={25} />
                </button>
              </div>
            </>
          </>
        )}
      </div>
    </>
  );
};
export default CourseContentMedia;
