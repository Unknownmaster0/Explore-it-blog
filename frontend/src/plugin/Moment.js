import moment from "moment";

// for getting the formated date
function Moment(date) {
  return moment(date).format("DD MMM, YYYY.");
}
export default Moment;
