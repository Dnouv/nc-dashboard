import React, { ChangeEvent, useState } from "react";
import { Card, CardActionArea, CardContent, CardHeader } from "@mui/material";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';


const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
  );

  const EditerMarkdown = dynamic(
    () =>
      import("@uiw/react-md-editor").then((mod) => {
        return mod.default.Markdown;
      }),
    { ssr: false }
  );

  const Markdown = dynamic(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    { ssr: false }
  );

export default function EditablePara() {
  const [value, setValue] = React.useState<string | undefined>(
    "**Hello world!!!**"
  );
  const [edit, setEdit] = useState(false)
  return (
    <Card>
      <CardContent>
      
      {edit && <MDEditor value={value} onChange={setValue} />}
      <div style={{ paddingTop: 50 }}>
        <Markdown source={value} />
      </div>
      </CardContent>
      <CardActionArea>
      <IconButton onClick={() => setEdit(!edit)} aria-label="delete">
        <EditIcon />
      </IconButton>
      </CardActionArea>
    </Card>
  );
}
