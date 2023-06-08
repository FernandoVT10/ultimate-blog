import { useReducer } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useMutation } from "@hooks/api";
import { serverErrorHandler } from "@utils/errorHandlers";
import { FileDirectoryOpenFillIcon } from "@primer/octicons-react";
import { BlogPost } from "@customTypes/collections";
import { appendArrayToFormData } from "@utils/form";

import CoverSelector from "@components/BlogPostForm/CoverSelector";
import TitleInput from "@components/BlogPostForm/TitleInput";
import ContentEditor from "@components/BlogPostForm/ContentEditor";
import TagEditor from "@components/BlogPostForm/TagEditor";
import Button from "@components/Button";

import withAuthorization from "../../hoc/withAuthorization";

import styles from "./CreatePost.module.scss";

type State = {
  cover: File | null;
  title: string;
  content: string;
  tags: string[];
};

type Action = 
  // Field type means: I'm gonna take all the keys from "State" but excluding cover and tags.
  | { type: "CHANGE_STRING", field: Exclude<keyof State, "cover" | "tags">, value: string }
  | { type: "CHANGE_COVER", file: File }
  | { type: "CHANGE_TAGS", value: State["tags"] };

function reducer(state: State, action: Action): State {
  switch(action.type) {
    case "CHANGE_STRING":
      return {
        ...state,
        [action.field]: action.value
      };

    case "CHANGE_COVER":
      return {
        ...state,
        cover: action.file
      };

    case "CHANGE_TAGS":
      return {
        ...state,
        tags: action.value
      };

    default:
      return state;
  }
}

const initialState: State = {
  cover: null,
  title: "",
  content: "",
  tags: []
};

function CreatePost() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, run: createPost } = useMutation<BlogPost>(
    "post",
    "/blogposts",
    serverErrorHandler
  );

  const router = useRouter();

  const handleClick = async () => {
    if(!state.cover) {
      return toast.error("Cover is required");
    }

    const formData = new FormData();

    formData.append("title", state.title);
    formData.append("content", state.content);
    formData.append("cover", state.cover);

    appendArrayToFormData("tags", state.tags, formData);

    const res = await createPost(formData);

    if(res.data) {
      const createdPost = res.data;
      router.push(`/blog/${createdPost._id}`);
    }
  };

  const handleOnChangeCover = (cover: File): boolean => {
    dispatch({
      type: "CHANGE_COVER",
      file: cover
    });
    return true;
  };

  return (
    <div className={styles.container}>
      <CoverSelector onChangeCover={handleOnChangeCover}/>

      <div className={styles.contentContainer}>
        <TitleInput
          title={state.title}
          setTitle={(title) => dispatch({
            type: "CHANGE_STRING",
            field: "title",
            value: title
          })}
        />

        <ContentEditor content={state.content} setContent={
          (content) => dispatch({
            type: "CHANGE_STRING",
            field: "content",
            value: content
          })
        }/>

        <TagEditor
          selectedTags={state.tags}
          setSelectedTags={(tags) => dispatch({
            type: "CHANGE_TAGS",
            value: tags
          })}
        />

        <Button
          type="submit"
          text="Create Post"
          loadingText={"Creating Post"}
          loading={loading}
          icon={FileDirectoryOpenFillIcon}
          className={styles.submitButton}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default withAuthorization(CreatePost);
