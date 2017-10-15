/**
 * @param user_id
 * @return all own ALBUM's + all public ALBUM's others USER's
 */
Album.GetAllOwnAndOtherPublic = function (user_id) {
    return this.query()
        .where({ user_id: user_id })
        .orWhere({ private: false })
        .eager('tags')
        .then(function (data) {
            if (!data.length) throw { message: 'Empty response' };
            return data;
        })
        .catch(function (error) {
            throw error.message || error;
        });
};

// Get Albums By Tag Id with pagination
// by @koskimas
this.query().findById(tag_id).then(tag => {
    return tag.$relatedQuery('posts')
        .orderBy('id', 'desc')
        .page(pageNumber, process.env.PAGE_SIZE)
        .then(posts => tag.posts = posts);
})

// Get post with TAGs and COMMENTs (wrong way)
Post.GetById = function (id) {
    let postDataResult;

    return this.query()
        .findById(id)
        .eager('tags')
        .then(data => {
            postDataResult = data;
            return Comment.GetPostCommentsById(id);
        })
        .then(comments => {
            postDataResult.comments = comments;
            return postDataResult;
        })
        .then(finalData => {
            if (!finalData) throw { message: 'Empty response', status: 404 };
            return finalData;
        })
        .catch(error => {
            throw error;
        });
};

// Get ALBUM with all related PHOTO's, TAG's, COMMENTs to ALBUM and COMMENTs to PHOTOs
Album.GetById = function (id) {
    return this.query()
        .findById(id)
        .eager('[photos.comments, tags, comments]')
        .modifyEager('[photos.comments, comments]', builder => {
            builder.orderBy('created_at');
        })
        .then(function (data) {
            if (!data) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(function (error) {
            throw error;
        });
};

// tap example
Photo.getByIdAndIncrementViews = function (id) {
    return this.query()
        .findById(id)
        .eager('comments')
        .modifyEager('comments', builder => {
            builder.orderBy('created_at');
        })
        .then(data => {
            if (!data) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .tap(model => this.UPDATE(id, { views: model.views + 1 }) )
        .catch(error => {
            throw error.message || error;
        });
};



