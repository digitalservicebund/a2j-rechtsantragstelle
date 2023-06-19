type GetInitialStepArgs = {
  flow: any; // TODO correct type
};

export const getInitialStep = ({ flow }: GetInitialStepArgs) => {
  const baseUrl = flow.id;
  const name = flow.initial;

  return {
    name,
    url: `${baseUrl}${name}`,
  };
};
