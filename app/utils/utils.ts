import { Gig } from "app/types";

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
