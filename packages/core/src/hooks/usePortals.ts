import { ReactElement } from '../types';
import useGlobalState from './useGlobalState';

export default function usePortals() {
  return useGlobalState<Record<string, ReactElement>>('rbk-portals', {});
}
