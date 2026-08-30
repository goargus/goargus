#!/usr/bin/env python3
import argparse
import re
import sys

LIST_RE = re.compile(r'^(\s*)([-*+]|\d+[.)])\s+')
RULE_RE = re.compile(r'^\s*([-*_])\s*\1\s*\1')
BLOCK_PREFIXES = ('#', '|', '>')


def _is_boundary(line):
    return (not line.strip()
            or line.lstrip().startswith('```')
            or line.lstrip().startswith(BLOCK_PREFIXES)
            or LIST_RE.match(line) is not None)


def reflow(text):
    lines = text.split('\n')
    out, i, in_fence = [], 0, False
    while i < len(lines):
        line = lines[i]
        if line.lstrip().startswith('```'):
            in_fence = not in_fence
            out.append(line)
            i += 1
            continue
        if in_fence or not line.strip():
            out.append(line)
            i += 1
            continue
        if line.lstrip().startswith(BLOCK_PREFIXES) or RULE_RE.match(line):
            out.append(line)
            i += 1
            continue
        item = LIST_RE.match(line)
        if line.startswith('    ') and not item and (not out or not out[-1].strip()):
            out.append(line)
            i += 1
            continue
        buf = line.rstrip()
        j = i + 1
        while j < len(lines):
            nxt = lines[j]
            if _is_boundary(nxt):
                break
            if item and not nxt.startswith(' '):
                break
            if not item and nxt.startswith('    '):
                break
            buf += ' ' + nxt.strip()
            j += 1
        out.append(buf)
        i = j
    return '\n'.join(out)


def offenders(text):
    original = text.split('\n')
    fixed = reflow(text).split('\n')
    return len(original) - len(fixed)


def main():
    p = argparse.ArgumentParser(
        prog='gh-body.py',
        description=(
            'Unwrap hard-wrapped prose for GitHub issue, PR and comment '
            'bodies. GitHub renders every single newline inside a paragraph '
            'as a line break, so wrapped prose arrives with sentences split '
            'mid-clause. Code fences, tables, headings and list structure '
            'are preserved.'),
    )
    p.add_argument('file', nargs='?', help='body file; omit to read stdin')
    p.add_argument('--check', action='store_true',
                   help='exit 1 if the body would change, print nothing on success')
    p.add_argument('--fix', action='store_true',
                   help='rewrite the file in place')
    args = p.parse_args()

    if args.fix and not args.file:
        p.error('--fix needs a file')

    text = open(args.file, encoding='utf-8').read() if args.file else sys.stdin.read()
    result = reflow(text)

    if args.check:
        if result != text:
            n = offenders(text)
            where = args.file or 'stdin'
            print(f'{where}: {n} hard-wrapped line(s) would render as '
                  f'<br> on GitHub. Run gh-body.py --fix {where}',
                  file=sys.stderr)
            return 1
        return 0

    if args.fix:
        if result != text:
            open(args.file, 'w', encoding='utf-8').write(result)
            print(f'{args.file}: joined {offenders(text)} line(s)')
        return 0

    sys.stdout.write(result)
    return 0


if __name__ == '__main__':
    sys.exit(main())
