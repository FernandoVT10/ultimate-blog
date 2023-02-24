import { useReducer, useState } from "react";
import { useModal } from "@components/Modal";
import { createPost } from "@services/BlogPostService";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import { SidebarCollapseIcon } from "@primer/octicons-react";

import CoverSelection from "@components/BlogPostForm/CoverSelection";
import TitleInput from "@components/BlogPostForm/TitleInput";
import ContentEditor from "@components/BlogPostForm/ContentEditor";
import TagsModal from "@components/BlogPostForm/TagsModal";
import TagsList from "@components/BlogPostForm/TagsList";
import Spinner from "@components/Spinner";

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

export default function CreatePost() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);

  const tagsModal = useModal();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!state.cover) {
      return toast.error("Cover is required");
    }

    setLoading(true);

    try {
      const createdPost = await createPost({
        title: state.title,
        content: state.content,
        cover: state.cover,
        tags: state.tags
      });

      router.push(`/blog/${createdPost._id}`);
    } catch (error) {
      console.log(error);
      toast.error("There was an error trying to create the post");
    }

    setLoading(false);
  };

  const handleOnChangeCover = (cover: File): boolean => {
    dispatch({
      type: "CHANGE_COVER",
      file: cover
    });
    return true;
  };

  return (
    <div className={styles.createPost}>
      <TagsModal
        modal={tagsModal}
        selectedTags={state.tags}
        setSelectedTags={(tags) => dispatch({
          type: "CHANGE_TAGS",
          value: tags
        })}
      />

      <form onSubmit={handleSubmit}>
        <CoverSelection
          onChangeCover={handleOnChangeCover}
          displayChangeButton
        />

        <div className={styles.titleInputContainer}>
          <TitleInput
            title={state.title}
            setTitle={(title) => dispatch({
              type: "CHANGE_STRING",
              field: "title",
              value: title
            })}
          />
        </div>

        <ContentEditor content={state.content} setContent={(content) => dispatch({
          type: "CHANGE_STRING",
          field: "content",
          value: content
        })}/>

        <div className={styles.tagsListContainer}>
          <TagsList
            tags={state.tags}
            showTagsModal={() => tagsModal.showModal()}
            showEditButton
          />
        </div>

        <button
          className={`custom-btn ${styles.submitButton}`}
          disabled={loading}
        >
          { loading ?
            <>
              <Spinner size={10} borderWidth={2} className={styles.loader}/>
              Creating Post
            </>
          :
            <>
              <SidebarCollapseIcon size={16} className="icon" />
              Create Post
            </>
          }
        </button>
      </form>
    </div>
  );
}
