#!/usr/bin/python
# build_native.py
# Build native codes
# 
# Please use cocos console instead


import sys
import os, os.path
import shutil
from optparse import OptionParser

current_dir = os.path.dirname(os.path.realpath(__file__))
print '==================================================='
command = 'git add .'
print command
os.system(command)

command = 'git commit -m "Update"'
print command
os.system(command)

command = 'git push origin master'
print command
os.system(command)

