export type SendQuery = <T = unknown>(
  query: FirebaseFirestore.Query<T>
) => Promise<[T[], FirebaseFirestore.QuerySnapshot<T>]>;

const sendQuery: SendQuery = async (query) => {
  const querySnapshot = await query.get();

  if (querySnapshot.empty) return [[], querySnapshot];

  const docsDataList = querySnapshot.docs.map((doc) => doc.data());
  return [docsDataList, querySnapshot];
};

export { sendQuery };
