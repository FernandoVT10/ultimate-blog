import { useReducer } from "react";
import { useModal } from "@components/Modal";

import CoverSelection from "@components/BlogPostForm/CoverSelection";
import TitleInput from "@components/BlogPostForm/TitleInput";
import ContentEditor from "@components/BlogPostForm/ContentEditor";
import TagsModal from "@components/BlogPostForm/TagsModal";
import TagsList from "@components/BlogPostForm/TagsList";

import styles from "./CreateBlogPostForm.module.scss";

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

export default function CreateBlogPostForm() {
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
    <div className={styles.createBlogPostForm}>
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

        <TitleInput
          title={state.title}
          setTitle={(title) => dispatch({
            type: "CHANGE_STRING",
            field: "title",
            value: title
          })}
        />

        <ContentEditor content={state.content} setContent={(content) => dispatch({
          type: "CHANGE_STRING",
          field: "content",
          value: content
        })}/>

        <TagsList
          tags={state.tags}
          showTagsModal={() => tagsModal.showModal()}
          showEditButton
        />
      </form>
    </div>
  );
}
