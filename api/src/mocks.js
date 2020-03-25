import mockQueries from "./queries/mocks";
import mockDomain from "./domain/mocks";

const restore = () => {
  mockQueries.restore();
  mockDomain.restore();
};

export default {
  queries: mockQueries,
  domain: mockDomain,
  restore,
};
