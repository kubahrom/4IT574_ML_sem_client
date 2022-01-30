import { ThemeProvider } from "@emotion/react";
import {
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Container,
} from "@mui/material";
import styled from "styled-components";
import Model from "./components/Model";
import Links from "./components/Links";

function App() {
  const theme = createTheme({
    palette: {},
  });

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Box sx={wrapperStyles}>
          <Container sx={{ maxWidth: { lg: 1100 } }}>
            <StyledLogo src="/logo192.png" alt="logo" />
            <Typography variant="h4" component="h1" align="center">
              Animal image classifier
            </Typography>
            <Box sx={linksStyles}>
              <Links
                text="client"
                link="https://github.com/kubahrom/4IT574_sem"
              />
              <Links
                text="server"
                link="https://github.com/kubahrom/4IT574_sem_server"
              />
            </Box>
            <Model />
          </Container>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;

const wrapperStyles = { py: 16 };

const StyledLogo = styled.img`
  margin: auto;
  display: flex;
  justify-content: center;

  width: 100px;
  height: 100px;
`;

const linksStyles = {
  display: "flex",
  gap: 2,
  justifyContent: "center",
  py: 1,
};
