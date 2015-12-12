export let ignoredTerms = localStorage.getItem("ignoredTerms");

if (!ignoredTerms) {
  ignoredTerms = [
    "to",
    "for",
    "with",
    "on",
    "be",
    "in",
    "of",
    "in",
    "an",
    "a"
  ]

  localStorage.setItem("ignoredTerms", ignoredTerms);
}

export let termWeightings = JSON.parse(localStorage.getItem("termWeightings"));
// TODO - these are case sensitive at the moment
if (!termWeightings) {
  termWeightings = {
    "trump": 1,
    "amazon": 3,
    "google": 6,
    "programming": 6,
    "javascript": 9,
    "python": 9,
    "netflix": 7,
    "hulu": 7,
    "playstation": -5,
    "xbox": -5,
    "smartphone": -12,
    "nasa": -5,
    "obama": -9,
    "indy": 10,
    "indianapolis": 10,
    "fishers": 10,
    "carmel": 10,
    "westfield": 10,
    "software": 8,
    "star": -12,
    "galaxy": -14,
    "pacers": -18,
    "bitcoin": -12,
    "wordpress": -8,
    "murder": -5,
    "sentenced": -8
  }

  localStorage.setItem("termWeightings", JSON.stringify(termWeightings));
}

termWeightings.deleteTerm = (term) => {
  delete termWeightings[term];
  localStorage.setItem("termWeightings", JSON.stringify(termWeightings));
}
