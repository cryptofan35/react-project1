import { RUNNING, FUTURE, FAILED, PAST, NEW } from "constants/Packages/Statuses";

export const getStatus = (packageObject) => {
  const { runningOffersCount, futureOffersCount, failedOffersCount, pastOffersCount } = packageObject;
  if (runningOffersCount > 0) {
    return RUNNING;
  }

  if (futureOffersCount > 0) {
    return FUTURE;
  }

  if (failedOffersCount > 0) {
    return FAILED;
  }

  if (pastOffersCount > 0) {
    return PAST;
  }

  if (runningOffersCount == 0 && futureOffersCount == 0 && failedOffersCount == 0 && pastOffersCount == 0) {
    return NEW;
  }

  return null;
}