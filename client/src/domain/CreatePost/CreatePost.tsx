import { useReducer } from "react";
import { useModal } from "@components/Modal";

import CoverSelection from "@components/BlogPostForm/CoverSelection";
import TitleInput from "@components/BlogPostForm/TitleInput";
import ContentEditor from "@components/BlogPostForm/ContentEditor";
import TagsModal from "@components/BlogPostForm/TagsModal";
import TagsList from "@components/BlogPostForm/TagsList";

import styles from "./CreatePost.module.scss";
import { SidebarCollapseIcon } from "@primer/octicons-react";

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
  const tagsModal = useModal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleOnChangeCover = (cover: File): boolean => {
    dispatch({
      type: "CHANGE_COVER",
      file: cover
    });
    return true;
  };

  return (
    <div className={`wrapper ${styles.createPost}`}>
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

        <button className={`custom-btn ${styles.submitButton}`}>
          <SidebarCollapseIcon size={16} className="icon" />
          Create Post
        </button>
      </form>
    </div>
  );
}
