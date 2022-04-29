import { rest, DefaultRequestBody } from "msw";
import { factory, primaryKey } from "@mswjs/data";

const db = factory({
  user: {
    id: primaryKey(String),
    firstName: String,
  },
  post: {
    id: primaryKey(String),
    authorId: String,
    title: String,
  },
});

type PostBody = {
  id: string;
  authorId: string;
  title: string;
};

type GetPostPathParams = {
  authorId: string;
};

export const handlers = [
  ...db.user.toHandlers("rest"),
  rest.post<PostBody>("/posts", (req, res, ctx) => {
    if (req.headers.get("authorization") === "Bearer AUTH_TOKEN") {
      return res(ctx.status(403));
    }

    const postObject = req.body;
    const existingPost = db.post.findFirst({
      where: {
        id: {
          equals: postObject.id,
        },
      },
    });

    if (existingPost) {
      throw new Error("The post already exists");
    }

    const newPost = db.post.create(req.body);

    return res(ctx.status(201), ctx.json({ post: newPost }));
  }),
  rest.get<DefaultRequestBody, GetPostPathParams>(
    "/posts/:authorId",
    (req, res, ctx) => {
      const { authorId } = req.params;
      const result = db.post.findMany({
        where: {
          authorId: {
            equals: authorId,
          },
        },
      });
      return res(ctx.status(200), ctx.json(result));
    }
  ),
];
