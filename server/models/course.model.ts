import mongoose, { Document, Model, Schema } from 'mongoose';

interface IComment extends Document {
    user: string,
    comment: string;
}

interface IReview extends Document {
    user: string,
    rating: number,
    comment: string;
    commentReplices: IComment[];
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
    VideoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion : string;
    comments: IComment[];
}
