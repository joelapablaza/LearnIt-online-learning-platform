import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComent extends Document {
  user: IUser;
  question: string;
  questionReplies: IComent[];
}

interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies?: IComent[];
  avatar?: string;
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComent[];
}

interface ICourse extends Document {
  name: string;
  description: string;
  categories: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased: number;
}

const reviewSchema = new Schema<IReview>(
  {
    user: Object,
    avatar: String,
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
    commentReplies: [Object],
  },
  { timestamps: true }
);

const linkSchema = new Schema<ILink>(
  {
    title: String,
    url: String,
  },
  {
    _id: false,
  }
);

const commentSchema = new Schema<IComent>(
  {
    user: Object,
    question: String,
    questionReplies: [Object],
  },
  { timestamps: true }
);

const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      requried: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      requried: true,
    },
    estimatedPrice: Number,
    thumbnail: {
      public_id: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: true,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    demoUrl: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const courseModel: Model<ICourse> = mongoose.model("course", courseSchema);

export default courseModel;
