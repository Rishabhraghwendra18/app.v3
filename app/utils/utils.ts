import { Gig } from "app/types";
const ethers = require("ethers");

export const smartTrim = (string: string, maxLength: number) => {
  if (maxLength < 1) return string;
  if (string.length <= maxLength) return string;
  if (maxLength === 1) return `${string.substring(0, 1)}...`;

  const midpoint = Math.ceil(string.length / 2 + 1);
  const toremove = string.length - maxLength;
  const lstrip = Math.ceil(toremove / 2);
  const rstrip = toremove - lstrip;
  return `${string.substring(0, midpoint - lstrip)}...${string.substring(
    midpoint + rstrip
  )}`;
};

export const filterByDate = (
  gigs: Array<Gig> | undefined,
  deadlineFilter: Array<number>
) => {
  function filterDate(item) {
    const today = new Date();
    const min = new Date(today);
    min.setDate(min.getDate() + deadlineFilter[0]);
    const max = new Date(today);
    max.setDate(min.getDate() + deadlineFilter[1]);
    if (item.deadline.iso) {
      item.deadline = new Date(item.deadline.iso);
    }
    if (item.deadline > min && item.deadline < max) {
      return true;
    }
    return false;
  }
  return gigs && gigs.filter(filterDate);
};

export function toEther(val) {
  return ethers.utils.parseEther(val);
}

export function fromWei(val) {
  if (!val) {
    return val;
  }
  return ethers.utils.formatEther(val);
}

function msToTime(ms: number) {
  let seconds = parseInt((ms / 1000).toFixed(0));
  let minutes = parseInt((ms / (1000 * 60)).toFixed(0));
  let hours = parseInt((ms / (1000 * 60 * 60)).toFixed(0));
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
  if (seconds < 0) return "Expired";
  else if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Min";
  else if (hours < 24) return hours + " Hrs";
  else return days + " Days";
}

export function formatTimeLeft(date) {
  const deadline = new Date(date);
  const now = Date.now();
  return msToTime(deadline.getTime() - now);
}

export function formatTimeAgo(date) {
  const now = Date.now();
  return msToTime(now - date);
}

export function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = ("0" + minutes).slice(-2);
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
