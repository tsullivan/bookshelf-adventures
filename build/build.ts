import * as esbuild from 'esbuild'
import { getBuildContext } from './build_context';

esbuild.build(getBuildContext())
