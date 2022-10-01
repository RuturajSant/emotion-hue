import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { Container } from '@mui/system'
import React, { useState } from 'react'
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_MYKEY,
});
const openai = new OpenAIApi(configuration);

const Moody = () => {
    const [prompt, setPrompt] = useState("");
    const [mood, setMood] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValid, setValid] = useState(true);



    const handleChange = (event) => {
        setPrompt(event.target.value);
    }
    const checkIfHexadecimal = (str) => {
        var re = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
        return re.test(str);// ^ matches first word which is # then matches any word between 0 to 9 and A to F and matches only {6} values, $ signifies to match end of string and i shows case insensitive. all regex is written inside /^ $/ 
    }
    const handleClick = async () => {
        setLoading(true);
        try {
            const response = await openai.createCompletion("text-davinci-002", {
                prompt: `The CSS hex color code for ${prompt}:\n\n`,
                temperature: 0,
                max_tokens: 64,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: [";"],
            });
            const color = response.data.choices[0].text.slice(2);
            if (checkIfHexadecimal(color)) {
                setMood(color);
                setValid(true);
            } else {
                setMood("#ddd");
                setValid(false);
            }
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }

    return (
        <Container sx={{ minHeight: "100vh", backgroundColor: `${mood ? mood : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.5s ease" }} maxWidth='xl'>
            <Card sx={{ maxWidth: 275 }}>
                <CardContent>
                    <Stack spacing={2}>
                        <TextField id="outlined-basic" label="Prompt" variant="outlined" value={prompt} onChange={handleChange} />
                        <Button onClick={handleClick} variant="contained">Submit</Button>
                        <Typography variant="h6" align="center">{loading ? "Loading..." : isValid ? mood : "Couldn't find color"}</Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    )
}

export default Moody

