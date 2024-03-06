export default function reference(ref, mirrorRef?) {
  let newRef = ref;

  if (mirrorRef && typeof ref === 'function') {
    newRef = ($scope) => {
      ref($scope);
      mirrorRef.current = $scope;
    };
  }

  return newRef;
}
