import { useReducer } from "react";

import TitleInput from "@components/BlogPostForm/TitleInput";
import ContentEditor from "@components/BlogPostForm/ContentEditor";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.createBlogPostForm}>
      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}
