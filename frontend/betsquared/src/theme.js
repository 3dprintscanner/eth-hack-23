import { createTheme } from '@mui/material/styles';

import { colors } from '@mui/material';

const theme = createTheme({
    palette: {
        type: "light",
        primary: {
          // Use hue from colors or hex
          main: '#34148b',
          // Uncomment to specify light/dark
          // shades instead of automatically
          // calculating from above value.
          //light: "#4791db",
          //dark: "#115293",
        },
        secondary: {
          main: colors.pink["500"],
        },
        background: {
          // Background for <body>
          // and <Section color="default">
          default: "#fff",
          // Background for elevated
          // components (<Card>, etc)
          paper: "#fff",
        },
      },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Apply a custom font (Poppins)
  },
  spacing: 4, // Increase spacing between elements,
  components: {
    MuiContainer: {
        styleOverrides: {
            root: {
                background: 'radial-gradient(purple, blue)',
                backgroundAttachment: 'fixed',
                height: '100vh', //
            }
        }
    }
  }
});

export default theme;