import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    //marginTop: theme.spacing(10),
  },
  button: {
    //margin: theme.spacing(10),
  },
  input: {
    display: 'none',
  },
}));

export default useStyles;
