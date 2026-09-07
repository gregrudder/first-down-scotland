#!/usr/bin/env python3
"""Deprecated: icons now come from public/logo.png via scripts/export-brand-icons.mjs."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    script = Path(__file__).resolve().parent / "export-brand-icons.mjs"
    raise SystemExit(subprocess.call(["node", str(script)], cwd=root))


if __name__ == "__main__":
    main()
