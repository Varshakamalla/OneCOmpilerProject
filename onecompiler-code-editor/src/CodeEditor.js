import React, { useEffect, useRef, useState } from 'react';
import { Button, Switch, Box } from '@mui/material';
import Confetti from 'react-confetti';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';

const CodeEditor = () => {
    const iframeRef = useRef(null);
    const [code, setCode] = useState(localStorage.getItem('code') || '// Your code here');
    const [darkTheme, setDarkTheme] = useState(false);
    const [confettiVisible, setConfettiVisible] = useState(false);

    useEffect(() => {
        window.onmessage = (e) => {
            if (e.data && e.data.language) {
                console.log(e.data);
            }
        };
        localStorage.setItem('code', code); 
    }, [code]);

    const runCode = () => {
        iframeRef.current.contentWindow.postMessage({ eventType: 'triggerRun' }, '*');
        setConfettiVisible(true);
        setTimeout(() => setConfettiVisible(false), 3000); 
    };

    const formatCode = () => {
        try {
            const formattedCode = prettier.format(code, {
                parser: "babel",
                plugins: [parserBabel],
                singleQuote: true,
                trailingComma: "all",
            });
            setCode(formattedCode);
            alert('Code formatted!');
        } catch (error) {
            console.error("Formatting error:", error);
            alert('Error formatting code. Please check your syntax.');
        }
    };

    return (
        <Box sx={{ backgroundColor: darkTheme ? '#333' : '#fff', color: darkTheme ? '#fff' : '#000', padding: 2 }}>
            {confettiVisible && <Confetti />}
            <Switch checked={darkTheme} onChange={() => setDarkTheme(!darkTheme)} />
            <span>Toggle Dark Theme</span>
            <Button variant="contained" onClick={runCode}>Run</Button>
            <Button variant="contained" onClick={formatCode}>Format Code</Button>
            <iframe
                ref={iframeRef}
                frameBorder="0"
                height="450px"
                src={`https://onecompiler.com/embed/javascript?listenToEvents=true&theme=${darkTheme ? 'dark' : 'light'}`}
                width="100%"
                onLoad={() => {
                    iframeRef.current.contentWindow.postMessage({ eventType: 'populateCode', language: 'javascript', files: [{ name: 'script.js', content: code }] }, '*');
                }}
            ></iframe>
        </Box>
    );
};

export default CodeEditor;
